import React, { useState, Fragment } from 'react';
import styled from 'styled-components';

interface Member {
  amount: number
}

const useMemberList = (init: Member[]) => {
  const [memberListState, setMemberListState] = useState<Member[]>(init);
  const setMemberList = (index: number, key: string, value: string) => {
    setMemberListState(memberListState
      .map((member, i) => (i === index) ? { ...member, [key]: value } : member)
    );
  }
  const addMember = () => setMemberListState([...memberListState, { amount: 0 }]);
  const removeMember = (index: number) => setMemberListState(memberListState.filter((member, i) => i !== index));
  const sumTotal = memberListState.reduce((sum, mem) => sum + Number(mem.amount), 0);
  return {
    setMemberList,
    memberList: memberListState,
    addMember,
    removeMember,
    sumTotal
  };
};

interface DiscountRate {
  rate: number
  cap: number
}

const useDiscount = (rate: number, cap = 0) => {
  const [discountRate, setDiscountRate] = useState<DiscountRate>({ rate, cap });
  const calcualteDiscount = (sum: number, isConstant = false) => {
    if (!isConstant && discountRate.rate === 0) return sum;
    const discounted = Math.round((sum * (1 - (discountRate.rate / 100))) * 100) / 100;
    if (discountRate.cap !== 0 && discounted > discountRate.cap) return sum - discountRate.cap;
    return discounted;
  };
  const setDiscount = (type: string, value: string) => {
    const newDiscount = type === 'rate'
      ? { rate: Number(value), cap: discountRate.cap }
      : { rate: discountRate.rate, cap: Number(value) }
    setDiscountRate(newDiscount);
  };
  return {
    setDiscount,
    discount: discountRate,
    getDiscountedPrice: calcualteDiscount,
  }
};

const Input = styled.input`
  border-radius: 6px;
  border: 1px solid #d8d8d8;
  padding: 5px 16px;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  @media (max-width: 600px) {
    width: 60%;
  }
`;

const DCInput = styled(Input)`
  width: 100px;
  @media (max-width: 600px) {
    width: 80px;
  }
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  margin-bottom: 24px;
  @media (max-width: 600px) {
    // padding: 8px 0;
  }
`;

const Detail = styled(FlexColumn)`
  margin: auto 16px 16px;
  border: 2px solid #e4e4e4;
  border-radius: 6px;
  @media (max-width: 600px) {
    margin: auto 4px 4px;
  }
`;

const RowText = styled.div`
  margin: auto 4px;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const FlexRow = styled.div`
  display: flex;
  padding: 8px;
  @media (max-width: 600px) {
    padding: 8px 0;
  }
  // -webkit-transition: 1s ease-in-out;
  // -moz-transition: 1s ease-in-out;
  // -o-transition: 1s ease-in-out;
  // transition: 1s ease-in-out;
`;

const CheckBoxDiv = styled.div`
  cursor: pointer;
  margin-bottom: 8px;
`;

const AddButton = styled.div`
  width: 100%;
  height: 48px;
  border-radius: 6px;
  background-color: blue;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const DelButton = styled.div`
  margin: auto;
  margin-left: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: red;
  width: 20px;
  height: 20px;
`;

const Extender = styled.div`
  margin: 8px auto;
  padding: 16px;
  cursor: pointer;
`;

const Text = styled.p`
  color: white;
  margin: 0 auto;
`;

const Result = styled.div`
  border-radius: 6px;
  padding: 8px 16px;
  background-color: #e4e4e4;
`;

const App = () => {
  const { memberList, setMemberList, addMember, removeMember, sumTotal} = useMemberList([{ amount: 0 }]);
  const { discount, setDiscount, getDiscountedPrice } = useDiscount(0);
  const [showRaito, setShowRatio] = useState(false);
  const [isConstantDiscount, setIsConstantDiscount] = useState(false);
  const discounted = getDiscountedPrice(sumTotal, isConstantDiscount);
  const priceDistribution = (price: number) => {
    const memberPrice = price;
    const actualDiscount = discount.cap !== 0
      ? (sumTotal - discounted > discount.cap ? discount.cap : sumTotal - discounted)
      : (sumTotal - discounted);
    const memberShare = sumTotal > 0 ? Math.round((memberPrice * 100 / sumTotal) ) : 0;
    const discountShare = Math.round(actualDiscount * (memberShare / 100));
    return {
      discount: discountShare,
      toBePaid: memberPrice - discountShare
    };
  };
  const toggleConstantDiscount = () => {
    setIsConstantDiscount(!isConstantDiscount);
  };
  return (
    <Fragment>      
      <AddButton onClick={() => addMember()}>
        <Text>+ Add more member</Text>
      </AddButton>
      <FlexColumn>
        {memberList.map((member, i) => (
          <FlexRow>
            <RowText>Member {i + 1}</RowText>
            <Input value={member.amount} type="number" onChange={e => setMemberList(i, 'amount', e.target.value)} />
            <DelButton onClick={() => removeMember(i)}><Text>X</Text></DelButton>
          </FlexRow>
        ))}
      </FlexColumn>
      <Detail>
        <p>Total : {sumTotal}</p>
        <CheckBoxDiv onClick={toggleConstantDiscount}>
          <input type="checkbox" checked={isConstantDiscount} />
          Calculate constant discount
        </CheckBoxDiv>
        <FlexRow>
          <DCInput value={discount.rate} onChange={(e) => setDiscount('rate', e.target.value)} disabled={isConstantDiscount} />
          <RowText> % off</RowText>
          <DCInput value={discount.cap} onChange={(e) => setDiscount('cap', e.target.value)} />
          <RowText> {isConstantDiscount ? 'Discount' : 'Discount Cap'}</RowText>
        </FlexRow>
        <Result>
          Total with Discount: {discounted}
        </Result>
      </Detail>
      <Extender onClick={() => setShowRatio(!showRaito)}>{showRaito ? 'Hide' : 'Show'} distribution</Extender>
      {showRaito &&
        <Detail>
          {memberList.map((member, i) => {
            const { discount, toBePaid } = priceDistribution(member.amount);
            return (
              <FlexColumn>
                <RowText>Member {i + 1} discount </RowText>
                <DCInput value={discount} type="number" disabled />
                <RowText>to pay </RowText>
                <DCInput value={toBePaid} type="number" disabled />
              </FlexColumn>
            );
          })}
        </Detail>
      }
    </Fragment>
  );
};

export default App;
